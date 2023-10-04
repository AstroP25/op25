FROM debian:bullseye-slim
# Envinronmental arguaments (allow users to adjust their configs upon running container)
ENV config_file="configs/p25_rtl-example.json"
# Update, clone op25 from Github and build
ADD op25.tar.gz /tmp/op25
RUN mkdir /tmp/op25/build
WORKDIR /tmp/op25/build
RUN apt-get update \
&& apt-get upgrade -y \
&& apt-get install -y gnuradio gnuradio-dev gr-osmosdr librtlsdr-dev libuhd-dev libhackrf-dev libitpp-dev libpcap-dev liborc-dev cmake git swig build-essential pkg-config doxygen python3-numpy python3-waitress python3-requests gnuplot-x11 \
&& cmake ../ \
&& make \
&& make install \
&& ldconfig \
&& apt-get clean
COPY configs /tmp/op25/op25/gr-op25_repeater/apps/
WORKDIR /tmp/op25/op25/gr-op25_repeater/apps
EXPOSE 8080
CMD ["python3","multi_rx.py","-c","p25_rtl-example.json"]

