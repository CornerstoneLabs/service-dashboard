"""Get status of APT."""

from fabric.operations import run
from status_base import save, setup_environment, schedule_log, mongo_collection, mongo_database

setup_environment()


def convert(data):
    """Convert the output to JSON."""
    lines = data.split('\n')

    output = []

    for line in lines:
        line_data = line.split(' ', 1)
        output.append({
            'qty': int(line_data[0]),
            'information': line_data[1]
        })
    return output


def status():
    """Run APT status."""
    schedule_log("Starting APT Status")

    output = run('/usr/lib/update-notifier/apt-check --human-readable', pty=False)

    data = convert(output)

    status = True

    for item in data:
        if item['qty'] > 0:
            status = False

    save(status, data, mongo_database(), mongo_collection(), output)

    schedule_log("Finished")
