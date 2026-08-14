#!/bin/ash
# Require legacy CMAKE, Alpine 3.22 or earlier only at this point.
apk update --no-cache
apk upgrade

apk add git build-base gnuradio gnuradio-dev gr-osmosdr rtl-sdr uhd-libs cmake doxygen boost clang clang-dev cppunit cppunit-dev py3-pybind11 py3-numpy py3-waitress py3-setuptools gnuplot libsndfile spdlog hackrf
git clone https://github.com/boatbod/op25.git
cd op25
ash build_bindings.sh
mkdir build
cd build
cmake -DC


