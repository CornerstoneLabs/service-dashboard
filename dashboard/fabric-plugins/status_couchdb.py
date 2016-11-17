"""Get status of CouchDB."""

import json
from status_base import save, setup_environment, schedule_log, safe_run, mongo_collection, mongo_database, get_parameters

setup_environment()


def status():
    """Run check on CouchDB."""
    schedule_log("Starting CouchDB Monitor")

    databases = get_parameters()

    store_data = []

    for database_name in databases:
        schedule_log(database_name)
        command_text = 'curl http://127.0.0.1:5984/%s' % database_name

        schedule_log('Running: %s' % command_text)

        output, error = safe_run(command_text)

        schedule_log('Parsing JSON')

        try:
            data = json.loads(output)

            schedule_log('Loaded json, saving.')

            store_data.append(data)
        except Exception as ex:
            schedule_log('Reporting as failed.')
            schedule_log('%s' % ex)
            schedule_log(output)
            error = '%s'

    if error:
        save(False, store_data, mongo_database(), mongo_collection(), error)
    else:
        save(True, store_data, mongo_database(), mongo_collection(), output)

    schedule_log('Finished')
