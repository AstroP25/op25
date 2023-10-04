FROM debian:bullseye-slim
# Envinronmental arguaments (allow users to adjust their configs upon running container)
ENV config_file="configs/config.json"
# Update, clone op25 from Github and build
ADD * /tmp/op25
WORKDIR /tmp/op25
RUN apt-get update \
&& apt-get upgrade -y \
&& apt-get install -y gnuradio gnuradio-dev gr-osmosdr librtlsdr-dev libuhd-dev libhackrf-dev libitpp-dev libpcap-dev liborc-dev cmake git swig build-essential pkg-config doxygen python3-numpy python3-waitress python3-requests gnuplot-x11 \
&& mkdir build \
&& cd build \
&& cmake ../ \
&& make \
&& make install \
&& ldconfig \
&& apt-get clean
EXPOSE 8080
CMD ["./tmp/op25/op25/gr-op25_repeater/apps/multi_rx.py","-c","$config_file"]
