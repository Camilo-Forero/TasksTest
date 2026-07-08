FROM python:3.11-slim

WORKDIR /app

# Copy dependencies and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create the data directory explicitly inside the container
RUN mkdir -p /app/data

# Copy the rest of your application code
COPY . .

EXPOSE 8000

# (Your docker-compose overrides the CMD, but it's good practice to keep this here)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
