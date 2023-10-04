FROM debian:bullseye-slim
# Envinronmental arguaments (allow users to adjust their configs upon running container)
ENV config_file="configs/config.json"
# Update, clone op25 from Github and build
ADD * /tmp/op25
WORKDIR /tmp/op25
RUN apt update \
&& apt upgrade -y \
&& chmod +x docker_install.sh \
&& ./docker_install.sh \
&& apt clean
EXPOSE 8080
CMD ["./run/op25/op25/gr-op25_repeater/apps/multi_rx.py","-c","$config_file"]
