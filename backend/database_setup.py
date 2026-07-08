from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

# --- Database Setup ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# --- SQLAlchemy Model Definitions ---
class State(Base):
    __tablename__ = "states"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, unique=True, index=True)


class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    state_id = Column(Integer, ForeignKey("states.id"))
    creationDate = Column(DateTime, default=datetime.utcnow)
    updateDate = Column(DateTime, default=datetime.utcnow)

    # Define the relationship: How Task relates to State
    state = relationship("State", back_populates="tasks")


# --- Database Initialization ---
Base.metadata.create_all(bind=engine)


# --- Data Seeding Function ---
def initialize_states():
    """Ensures 'pending' and 'completed' states exist in the database."""
    db = SessionLocal()
    try:
        print("Starting database state initialization...")

        # Check if 'pending' state exists
        if not db.query(State).filter(State.description == "pending").first():
            pending_state = State(description="pending")
            db.add(pending_state)

        # Check if 'completed' state exists
        if not db.query(State).filter(State.description == "completed").first():
            completed_state = State(description="completed")
            db.add(completed_state)

        db.commit()
        print("Database states initialized successfully.")

    except Exception as e:
        db.rollback()
        print(f"FATAL ERROR during state initialization: {e}")
    finally:
        db.close()
