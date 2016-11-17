"""Common functions for all status tasks."""

from fabric.api import env
from fabric.api import settings
from fabric.operations import run
from pymongo import MongoClient
import datetime
import json
import os

batch = datetime.datetime.utcnow()


class FabricException(Exception):
    """Error."""

    pass


def save(ok, data, database_name, collection_name, captured_output=None):
    """Save the data."""
    client = MongoClient('192.168.1.90', 27017)
    database = getattr(client, database_name)
    collection = database[collection_name]

    post = {
        "data": data,
        "ok": ok,
        "date": datetime.datetime.utcnow(),
        "ip": env.host_string
    }

    if captured_output:
        post["output"] = captured_output

    inserted_id = collection.insert_one(post).inserted_id
    return inserted_id


def schedule_log(text):
    """Log a schedule item."""
    global batch

    database_name = 'dumteedum_status'
    client = MongoClient('192.168.1.90', 27017)
    database = getattr(client, database_name)
    collection = database['SCHEDULE_LOG']

    post = {
        "date": datetime.datetime.utcnow(),
        "batch": batch,
        "ip": env.host_string,
        "schedule_id": os.environ['DASHBOARD_SCHEDULE_ID'],
        "message": text
    }

    inserted_id = collection.insert_one(post).inserted_id
    return inserted_id


def safe_run(command_text):
    """Run and capture an error."""
    output = None
    error = None

    with settings(abort_exception=FabricException):
        try:
            schedule_log('In settings context')
            output = run(command_text)
        except FabricException as ex:
            error = '%s' % ex
            schedule_log('Error %s' % ex)

    return output, error


def mongo_collection():
    """Return the collection from the environment."""
    return os.environ['DASHBOARD_MONGO_COLLECTION']


def mongo_database():
    """Return the database from the environment."""
    return os.environ['DASHBOARD_MONGO_DATABASE']


def get_parameters():
    """Return parameters passed in."""
    parameters = os.environ['DASHBOARD_PARAMETERS']
    print(parameters)
    schedule_log('Parameters read: %s' % parameters)
    parsed = json.loads(parameters)
    print(parsed)
    return parsed


def setup_environment():
    """Anything useful for the environment here."""
    env.hosts = [
        os.environ['hosts']
    ]
    env.user = os.environ['user']
    pass
