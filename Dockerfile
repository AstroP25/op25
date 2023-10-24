# syntax=docker/dockerfile:1
FROM alpine:3.18
# Envinronmental arguaments (allow users to adjust their configs upon running container)
ENV config_file="p25_rtl-example.json"
# Add ITPP
ADD itpp-4.3.1.tar.gz /tmp/ittp-4.3.1
WORKDIR /tmp
RUN apk --no-cache update \
&& apk upgrade \
&& apk add make cmake python3 mako boost-dev g++ gcc gmp py3-mako cppunit spdlog-dev gmp-dev py3-numpy-dev doxygen py3-pybind11-dev py3-packaging git
# Build SoapySDR
RUN cd /tmp \
&& git clone https://github.com/pothosware/SoapySDR.git \
&& cd SoapySDR \
&& mkdir build \
&& cd build \
&& cmake ../ \
&& make \
&& make test \
&& make install 
# Build Volk
RUN cd /tmp \
&& git clone --recursive https://github.com/gnuradio/volk.git \
&& cd volk \
&& mkdir build \
&& cd build \
&& cmake ../ \
&& make \
&& make test \
&& make install 
# Build GNURadio
RUN cd /tmp \
&& git clone https://github.com/gnuradio/gnuradio.git \
&& cd gnuradio \
&& mkdir build \
&& cd build \
&& cmake -DENABLE_MANPAGES=OFF -DCMAKE_BUILD_TYPE=Release ../ \
&& make -j$(nproc) \
&& make test \
&& make install 
# Build ITPP
RUN cd /tmp/itpp-4.3.1 \
&& mkdir build \
&& cd build \
&& cmake ../ \
&& make \
&& make install \
&& ldconfig
COPY configs /tmp/op25/op25/gr-op25_repeater/apps/
WORKDIR /tmp/op25/op25/gr-op25_repeater/apps
EXPOSE 8080
CMD python3 multi_rx.py -c $config_file
