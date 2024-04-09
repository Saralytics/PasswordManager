# syntax=docker/dockerfile:1
FROM python:3
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app/backend

# Install Pylint for static code analysis
RUN pip install pylint

COPY requirements.txt /app/backend/
RUN pip install -r requirements.txt
COPY . /app/backend/