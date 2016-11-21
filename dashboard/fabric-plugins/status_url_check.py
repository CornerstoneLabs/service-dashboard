"""Get status of disk."""

from status_base import mongo_collection
from status_base import mongo_database
from status_base import save
from status_base import schedule_log
from status_base import setup_environment
from status_base import get_parameters
from urllib.request import urlopen

setup_environment()


def status():
    """Run PM2 Monitor."""
    schedule_log("Starting URL checker")

    status = True
    output = ''
    data = {
        'results': []
    }

    urls = get_parameters()

    schedule_log('Got %s URLs' % len(urls))
    schedule_log('%s' % urls)

    for url in urls:
        schedule_log('Checking: %s' % url)
        try:
            get_code = urlopen(url).getcode()
            schedule_log('Got code: %s' % get_code)

            data['results'].append({
                'url': url,
                'status': get_code
            })
        except Exception as ex:
            status = False
            schedule_log('Exception: %s' % ex)
            data['results'].append({
                'url': url,
                'status': '%s' % ex
            })

        if get_code != 200:
            status = False

    save(status, data, mongo_database(), mongo_collection(), output)

    schedule_log("Finished")
