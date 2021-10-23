FROM canyan/janus-gateway:0.10.7

# Use custom configuration
COPY janus.jcfg /usr/local/etc/janus/janus.jcfg
COPY janus.transport.http.jcfg /usr/local/etc/janus/janus.transport.http.jcfg
COPY janus.plugin.videoroom.jcfg /usr/local/etc/janus/janus.plugin.videoroom.jcfg

# Copy SSL certs
COPY ./certs/localhost.crt /usr/local/etc/janus/certs/localhost.crt
COPY ./certs/localhost.key /usr/local/etc/janus/certs/localhost.key
