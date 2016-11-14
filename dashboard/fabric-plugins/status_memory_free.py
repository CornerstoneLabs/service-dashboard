"""Get status of memory."""

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
    """Run check on memory."""
    schedule_log("Starting Memory Monitor")

    command_text = 'free'
    output, error = safe_run(command_text)

    try:
        data = convert(output)
        save(True, data, mongo_database(), mongo_collection(), output)
    except Exception as ex:
        schedule_log('Reporting as failed.')
        schedule_log('%s' % ex)
        error = '%s'

    if error:
        save(False, {}, mongo_database(), mongo_collection(), error)

    schedule_log("Finished")
