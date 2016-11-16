"""Tests for disk."""
import unittest


class TestParser(unittest.TestCase):
    """Test the parser."""

    def test_parser(self):
        """Test the parser."""
        mock = """Filesystem     1K-blocks    Used Available Use% Mounted on
udev             1016260       0   1016260   0% /dev
tmpfs             204840    4764    200076   3% /run
/dev/vda1       30832488 6155400  23201796  21% /
tmpfs            1024184       0   1024184   0% /dev/shm
tmpfs               5120       0      5120   0% /run/lock
tmpfs            1024184       0   1024184   0% /sys/fs/cgroup
tmpfs             204840       0    204840   0% /run/user/0"""

        from status_disk import convert
        parsed = convert(mock)
        self.assertEqual(len(parsed), 1)
        self.assertEqual(parsed[0]['name'], '/dev/vda1')
        self.assertEqual(parsed[0]['size'], 30832488)
        self.assertEqual(parsed[0]['used'], 6155400)
        self.assertEqual(parsed[0]['available'], 23201796)
        self.assertEqual(parsed[0]['use%'], '21%')
        self.assertEqual(parsed[0]['mount'], '/')

if __name__ == '__main__':
    unittest.main()
