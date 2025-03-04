# Use an official Python runtime as the base image
FROM python:3.11

# Set the working directory inside the container
WORKDIR /dank_bank

# Copy the requirements.txt into the container and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project into the container
COPY . .

# Collect static files (optional for production)
RUN python manage.py collectstatic --noinput

# Expose port 8000 for the backend
EXPOSE 8000

# Command to run the application using Gunicorn
CMD ["gunicorn", "dank_bank.wsgi:application", "--bind", "0.0.0.0:8000"]
