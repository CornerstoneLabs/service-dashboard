install:
	mkdir env
	pyvenv ./env
	source env/bin/activate && pip3 install -r requirements.txt
