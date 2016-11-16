"""Get status of disk."""

from status_base import save, setup_environment, schedule_log, safe_run, mongo_collection, mongo_database


def convert(data):
    """Convert the output to JSON."""
    lines = data.split('\n')
    output = []

    for loop_line in lines:
        values = loop_line.split()

        if values[0] == 'Filesystem':
            pass

        if values[0].startswith('/dev'):
            output.append({
                'name': values[0],
                'size': int(values[1]),
                'used': int(values[2]),
                'available': int(values[3]),
                'use%': values[4],
                'mount': values[5]
            })

    return output


def status():
    """Run check on disk."""
    setup_environment()

    schedule_log("Starting Disk Monitor")

    command_text = 'df'
    output, error = safe_run(command_text)

    data = {}
    try:
        data = convert(output)
    except Exception as ex:
        error = ex

    if error:
        save(False, {}, mongo_database(), mongo_collection(), error)
    else:
        save(True, data, mongo_database(), mongo_collection(), output)

    schedule_log('Finished')
