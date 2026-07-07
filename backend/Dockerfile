FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Dummy key only used during build-time collectstatic — overridden by env var at runtime
RUN SECRET_KEY=build-only-placeholder python manage.py collectstatic --noinput

EXPOSE 8000

# loaddata runs on every boot so repo fixtures are the source of truth for
# site content (fixed pks make it idempotent). Note: this also reverts any
# edits made through the Django admin on each restart/deploy.
# seed_vault only fills an empty vault — unlike loaddata it never touches
# existing rows, because vault items are edited live through the UI.
CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py loaddata fixtures/initial_data.json && python manage.py seed_vault && gunicorn portfolio_backend.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 60"]
