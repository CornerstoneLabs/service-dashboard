"""Get status of disk."""

from status_base import save, setup_environment, schedule_log, safe_run, mongo_collection, mongo_database

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
    """Run check on disk."""
    schedule_log("Starting Disk Monitor")

    command_text = 'df -h'
    output, error = safe_run(command_text)

    if error:
        save(False, {}, mongo_database(), mongo_collection(), error)
    else:
        save(True, {}, mongo_database(), mongo_collection(), output)

    schedule_log('Finished')
