export default class WebRTCUtils {
    /**
     * Initialize a keep-alive mechanism for an RTCDataChannel.
     * @param {RTCDataChannel} dataChannel - The data channel to keep alive.
     */
    private initKeepAlive(dataChannel: RTCDataChannel) {
        setInterval(() => {
            if (document.hidden) {
                dataChannel.send("KEEPALIVE");
            }
        }, 800);
    }

    private handleMessage(event: MessageEvent) {
        console.log("Data channel message:", event.data);
    }

    private handleOpen(event: Event) {
        console.log("Data channel is open", event);
    }

    private handleClose(event: Event) {
        console.log("Data channel is closed", event);
    }

    /**
     * Set up the local RTCPeerConnection.
     * @param {RTCPeerConnection} local - The local RTCPeerConnection.
     * @param {RTCPeerConnection} remote - The remote RTCPeerConnection.
     */
    private async setLocalConnection(
        local: RTCPeerConnection,
        remote: RTCPeerConnection
    ): Promise<void> {
        await local.setLocalDescription(await local.createOffer());
        if (!local.localDescription) {
            throw new Error("Local description is null");
        }
        await remote.setRemoteDescription(local.localDescription);
    }

    /**
     * Set up the remote RTCPeerConnection.
     * @param {RTCPeerConnection} local - The local RTCPeerConnection.
     * @param {RTCPeerConnection} remote - The remote RTCPeerConnection.
     */
    private async setRemoteConnection(
        local: RTCPeerConnection,
        remote: RTCPeerConnection
    ): Promise<void> {
        await remote.setLocalDescription(await remote.createAnswer());
        if (!remote.localDescription) {
            throw new Error("Local description is null");
        }
        await local.setRemoteDescription(remote.localDescription);
    }

    /**
     * Initialize a WebRTC connection and return an RTCDataChannel.
     * @returns {Promise<RTCDataChannel>} - A promise that resolves to an initialized RTCDataChannel.
     */
    async initWebRTCConnection(): Promise<RTCDataChannel> {
        return new Promise(async (resolve, reject) => {
            try {
                const local = new RTCPeerConnection();
                const remote = new RTCPeerConnection();

                const sendChannel = local.createDataChannel("sendChannel");
                sendChannel.onopen = this.handleOpen;
                sendChannel.onmessage = this.handleMessage;
                sendChannel.onclose = this.handleClose;
                sendChannel.onopen = (e) => {
                    sendChannel.send("CONNECTED");
                    console.log(
                        "Data channel is open and initial message sent."
                    );
                };

                local.onicecandidate = async ({ candidate }) => {
                    if (!candidate) {
                        return;
                    }
                    await remote.addIceCandidate(candidate);
                };

                remote.onicecandidate = async ({ candidate }) => {
                    if (!candidate) {
                        return;
                    }
                    await local.addIceCandidate(candidate);
                };

                remote.ondatachannel = ({ channel }) => {
                    this.initKeepAlive(channel);
                    channel.onmessage = this.handleMessage;
                    channel.onopen = this.handleOpen;
                    channel.onclose = this.handleClose;
                    resolve(channel);
                };

                await this.setLocalConnection(local, remote);
                await this.setRemoteConnection(local, remote);
            } catch (error) {
                reject(error);
            }
        });
    }
}
