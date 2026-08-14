FROM alpine-sdr:3.22

ADD https://github.com/boatbod/op25.git /tmp/op25
ADD config.json example_keys.json p25_rtl_example.json p25_single_rtl_example.json /var/op25/

WORKDIR /tmp/op25
RUN ash build_bindings.sh
RUN cd /tmp/op25 && \
mkdir build && \
cd build && \
cmake -DCMAKE_INSTALL_PREFIX="/usr" ../ && \
make install && \
mkdir /op25 && \
cp -r /tmp/op25/op25/gr-op25_repeater/apps/ /op25/ && \
cd /tmp && \
rm -rf /tmp/op25

CMD ["multi_rx.py","-c","config.json","-v"]