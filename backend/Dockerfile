# Start from an official Python image
FROM python:3.12

# Set the working directory inside the container
WORKDIR /backend

# Install Poetry
RUN pip install poetry

# Disable Poetry's virtual environment creation
RUN poetry config virtualenvs.create false

# Copy pyproject.toml and poetry.lock from backend folder (not root)
COPY pyproject.toml poetry.lock ./

# Install dependencies
RUN poetry install --no-root

# Copy the rest of the project files from the backend directory
COPY . .

# Set PYTHONPATH so that Python can find the backend module
ENV PYTHONPATH=/backend

# Expose the port Django will run on
EXPOSE 8000

# Command to run Django's development server
CMD ["poetry", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]
