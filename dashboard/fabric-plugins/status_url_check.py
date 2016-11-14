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

    print(urls)
    for url in urls:
        print('Getting url ')
        print(url)
        get_code = urlopen(url).getcode()

        data['results'].append({
            'url': url,
            'status': status
        })

        if get_code != 200:
            status = False

    save(status, data, mongo_database(), mongo_collection(), output)

    schedule_log("Finished")
