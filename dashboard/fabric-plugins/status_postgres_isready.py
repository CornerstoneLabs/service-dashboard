"""Get status of postgres."""

from status_base import save, setup_environment, schedule_log, mongo_collection, mongo_database, safe_run

setup_environment()


def convert(data):
    """Convert the output to JSON."""
    items = data.split(' - ')
    return items


def status():
    """Run postgres isready."""
    schedule_log("Starting pg_isready")

    command_text = 'pg_isready'

    output, error = safe_run(command_text)

    try:
        data = convert(output)

        if data[1] == 'accepting connections':
            save(True, data, mongo_database(), mongo_collection(), output)
        else:
            save(False, data, mongo_database(), mongo_collection(), '')
    except Exception as ex:
        schedule_log('Reporting as failed.')
        schedule_log('%s' % ex)
        error = '%s'

    if error:
        save(False, {}, mongo_database(), mongo_collection(), error)

    schedule_log("Finished")
