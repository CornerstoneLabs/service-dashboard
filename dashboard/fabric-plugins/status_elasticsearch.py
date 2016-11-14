"""Get status of ES."""

import json
from status_base import save, setup_environment, schedule_log, safe_run, mongo_collection, mongo_database

setup_environment()


def status():
    """Run check on Elasticsearch."""
    schedule_log("Starting Elasticsearch Monitor")

    command_text = 'curl http://127.0.0.1:9200/_stats'

    schedule_log('Running: %s' % command_text)

    output, error = safe_run(command_text)

    try:
        data = json.loads(output)

        schedule_log('Loaded json, saving.')

        save(True, data, mongo_database(), mongo_collection(), output)
    except Exception as ex:
        schedule_log('Reporting as failed.')
        schedule_log('%s' % ex)
        error = '%s'

    if error:
        save(False, {}, mongo_database(), mongo_collection(), error)

    schedule_log('Finished')
