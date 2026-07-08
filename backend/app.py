from datetime import datetime, timezone
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, relationship, sessionmaker

# --- Database Setup ---
SQLALCHEMY_DATABASE_URL = "sqlite:////app/data/sql_app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# --- SQLAlchemy Models ---


class State(Base):
    __tablename__ = "states"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(
        String, unique=True, index=True
    )  # e.g., 'pending', 'completed'

    # Establish relationship back to tasks
    tasks = relationship("Task", back_populates="state")


class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    state_id = Column(
        Integer, ForeignKey("states.id")
    )  # Foreign Key link to State table
    creationDate = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updateDate = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Define the relationship: How Task relates to State
    state = relationship("State", back_populates="tasks")


# --- Database Initialization ---
Base.metadata.create_all(bind=engine)


def initialize_states():
    """Ensures 'pending' and 'completed' states exist in the database."""
    db = SessionLocal()
    try:
        for state_desc in ["pending", "completed"]:
            if not db.query(State).filter(State.description == state_desc).first():
                db.add(State(description=state_desc))
        db.commit()
        print("Database states initialized successfully.")
    except Exception as e:
        print(f"Error during state initialization: {e}")
        db.rollback()
    finally:
        db.close()


app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    """Runs data seeding once when the server starts."""
    initialize_states()


# --- Dependency to get DB session ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- Pydantic Schemas (Data Validation) ---


class StateResponse(BaseModel):
    id: int
    description: str

    class Config:
        from_attributes = True


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    state_description: str  # Users will pass 'pending' or 'completed'


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    state_description: Optional[str] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    state_id: int
    creationDate: datetime
    updateDate: datetime
    state: StateResponse  # Includes nesting of the state object

    class Config:
        from_attributes = True


# --- API Endpoints ---


@app.get("/")
def read_root():
    return {"message": "Welcome to the Task Management Backend!"}


# 1. GET ALL TASKS
@app.get("/api/todos", response_model=List[TaskResponse])
def get_all_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()


# 2. GET TASK BY ID
@app.get("/api/todos/{id}", response_model=TaskResponse)
def get_task_by_id(id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail=f"Task with ID {id} not found.")
    return task


# 3. CREATE A NEW TASK
@app.post("/api/todos", response_model=TaskResponse, status_code=201)
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    # Find the corresponding state
    state = (
        db.query(State)
        .filter(State.description == task_data.state_description.lower())
        .first()
    )
    if not state:
        raise HTTPException(
            status_code=400,
            detail=f"State '{task_data.state_description}' is invalid. Use 'pending' or 'completed'.",
        )

    new_task = Task(
        title=task_data.title, description=task_data.description, state_id=state.id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


# 4. UPDATE A TASK BY ID
@app.put("/api/todos/{id}", response_model=TaskResponse)
def update_task(id: int, task_data: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail=f"Task with ID {id} not found.")

    # Update basic fields if provided
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description

    # Update state relation if state_description is provided
    if task_data.state_description is not None:
        state = (
            db.query(State)
            .filter(State.description == task_data.state_description.lower())
            .first()
        )
        if not state:
            raise HTTPException(
                status_code=400,
                detail=f"State '{task_data.state_description}' is invalid.",
            )
        task.state_id = state.id

    task.updateDate = datetime.now(timezone.utc)
    db.commit()
    db.refresh(task)
    return task


# 5. DELETE A TASK BY ID
@app.delete("/api/todos/{id}")
def delete_task(id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail=f"Task with ID {id} not found.")

    db.delete(task)
    db.commit()
    return {"message": f"Task with ID {id} has been successfully deleted."}
