#!/usr/bin/python2.6

#  From https://apple.stackexchange.com/questions/73994/how-do-i-find-the-windowid-of-google-chrome-to-pass-to-screencapture-l

from itertools import chain
from Quartz import CGWindowListCreate as create_list
from Quartz import CGMainDisplayID as display_id
from Quartz import CGWindowListCreateDescriptionFromArray as lookup
import sys

class Windows(list):
    def find(self, name):
        for window in self:
            if window.OwnerName.find(name) > -1:
                print window

    def dump(self):
        for window in self:
            if window.IsOnscreen:
                print window


    def __getitem__(self, item):
        result = list.__getitem__(self, item)
        try:
            return Windows(result)
        except TypeError:
            return result

class Window(object):

    key_list = []

    def __init__(self, kwargs):
        for k in kwargs.keys():
            setattr(self, k.replace('kCGWindow',''), kwargs[k])
            self.key_list.append(k.replace('kCGWindow',''))

    def __repr__(self):
        t = '%d %d "%s" "%s"' % (
            getattr(self, 'Number', -1),
            getattr(self, 'Layer', -1),
            getattr(self, 'OwnerName', None),
            getattr(self, 'Name', None)
        )
        return t.encode('utf-8')

wlist=Windows()
for x in lookup(create_list(display_id(), 0)):
    wlist.insert(0, Window(dict(x)) )

if len(sys.argv) > 1:
    wlist.find(sys.argv[1])
else:
    wlist.dump()
