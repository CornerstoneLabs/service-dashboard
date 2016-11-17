"""Fabfile."""

import status_apt_check
import status_disk
import status_elasticsearch
import status_memory_free
import status_pm2_list
import status_url_check
import status_postgres_isready
import status_couchdb


def status():
    """Run checks."""
    status_elasticsearch.status()
    status_memory_free.status()
    status_disk.status()


def status__elasticsearch():
    """Run status."""
    status_elasticsearch.status()


def status__memory_free():
    """Run status."""
    status_memory_free.status()


def status__disk():
    """Run status."""
    status_disk.status()


def status__pm2_list():
    """Run pm2 status."""
    status_pm2_list.status()


def status__url_check():
    """Run url status."""
    status_url_check.status()


def status__apt_check():
    """Run apt status."""
    status_apt_check.status()


def status__postgres_isready():
    """Run pg_isready status."""
    status_postgres_isready.status()

def status__couchdb():
    """Check CouchDB status."""
    status_couchdb.status()