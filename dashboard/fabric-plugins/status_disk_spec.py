"""Tests for disk."""
import unittest


class TestParser(unittest.TestCase):
    """Test the parser."""

    def test_parser(self):
        """Test the parser."""
        mock = """Filesystem      Size  Used Avail Use% Mounted on
udev            993M     0  993M   0% /dev
tmpfs           201M  4.7M  196M   3% /run
/dev/vda1        30G  5.9G   23G  21% /
tmpfs          1001M     0 1001M   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs          1001M     0 1001M   0% /sys/fs/cgroup
tmpfs           201M     0  201M   0% /run/user/0"""

        from status_disk import convert
        parsed = convert(mock)
        self.assertEqual(len(parsed), 1)
        self.assertEqual(parsed[0]['name'], '/dev/vda1')
        self.assertEqual(parsed[0]['size'], '30G')

if __name__ == '__main__':
    unittest.discover()
