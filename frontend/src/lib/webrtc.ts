import wsService from './websocket';
import { SignalMessage } from '@/types/message';

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream = new MediaStream();
  private sessionId: string;
  private userId: number;
  private onRemoteStream: (stream: MediaStream) => void;
  private onConnectionStateChange: (state: RTCPeerConnectionState) => void;

  constructor(
    sessionId: string,
    userId: number,
    onRemoteStream: (stream: MediaStream) => void,
    onConnectionStateChange: (state: RTCPeerConnectionState) => void
  ) {
    this.sessionId = sessionId;
    this.userId = userId;
    this.onRemoteStream = onRemoteStream;
    this.onConnectionStateChange = onConnectionStateChange;
  }

  async startLocalStream(video = true, audio = true): Promise<MediaStream> {
    this.localStream = await navigator.mediaDevices.getUserMedia({ video, audio });
    return this.localStream;
  }

  async startScreenShare(): Promise<MediaStream> {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    if (this.peerConnection && this.localStream) {
      const videoTrack = screenStream.getVideoTracks()[0];
      const sender = this.peerConnection
        .getSenders()
        .find((s) => s.track?.kind === 'video');
      sender?.replaceTrack(videoTrack);
    }
    return screenStream;
  }

  createPeerConnection(): RTCPeerConnection {
    this.peerConnection = new RTCPeerConnection(ICE_SERVERS);

    // Add local tracks
    this.localStream?.getTracks().forEach((track) => {
      this.peerConnection!.addTrack(track, this.localStream!);
    });

    // Handle remote tracks
    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream.addTrack(track);
      });
      this.onRemoteStream(this.remoteStream);
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        wsService.send('/app/signal', {
          type: 'ice-candidate',
          from: this.userId,
          to: 0,
          sessionId: this.sessionId,
          payload: event.candidate,
        } as SignalMessage);
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      this.onConnectionStateChange(this.peerConnection!.connectionState);
    };

    return this.peerConnection;
  }

  async createOffer(targetUserId: number): Promise<void> {
    if (this.peerConnection) return;
    this.createPeerConnection();
    const offer = await this.peerConnection!.createOffer();
    await this.peerConnection!.setLocalDescription(offer);
    wsService.send('/app/signal', {
      type: 'offer',
      from: this.userId,
      to: targetUserId,
      sessionId: this.sessionId,
      payload: offer,
    } as SignalMessage);
  }

  async handleOffer(offer: RTCSessionDescriptionInit, fromUserId: number): Promise<void> {
    if (this.peerConnection) return;
    this.createPeerConnection();
    if (this.peerConnection!.signalingState !== "stable") {
      await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(offer));
    } else {
      await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(offer));
    }
    const answer = await this.peerConnection!.createAnswer();
    await this.peerConnection!.setLocalDescription(answer);
    wsService.send('/app/signal', {
      type: 'answer',
      from: this.userId,
      to: fromUserId,
      sessionId: this.sessionId,
      payload: answer,
    } as SignalMessage);
  }

  async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) return;

    // Prevent duplicate or invalid state application
    if (this.peerConnection.signalingState === "stable") {
      console.warn("Skipping setRemoteDescription: already stable");
      return;
    }

    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    await this.peerConnection!.addIceCandidate(new RTCIceCandidate(candidate));
  }

  toggleAudio(enabled: boolean): void {
    this.localStream?.getAudioTracks().forEach((t) => (t.enabled = enabled));
  }

  toggleVideo(enabled: boolean): void {
    this.localStream?.getVideoTracks().forEach((t) => (t.enabled = enabled));
  }

  cleanup(): void {
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.peerConnection?.close();
    this.peerConnection = null;
    this.localStream = null;
  }
}
