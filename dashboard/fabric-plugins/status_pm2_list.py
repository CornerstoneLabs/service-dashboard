"""Get status of disk."""

from fabric.operations import run
from status_base import save, setup_environment, schedule_log, mongo_collection, mongo_database
import json

setup_environment()


def convert(data):
    """Convert the output to JSON."""
    lines = data.split('\r')
    header = lines[0].split()
    values = lines[1].split()

    output = []

    for i in range(len(header)):
        output.append({
            'name': header[i],
            'value': values[i + 1]
        })
    return output


def status():
    """Run PM2 Monitor."""
    schedule_log("Starting PM2 Monitor")

    output = run('pm2 ls', pty=False)

    data = run('pm2 jlist', pty=False)

    save(True, json.loads(data), mongo_database(), mongo_collection(), output)

    schedule_log("Finished")
