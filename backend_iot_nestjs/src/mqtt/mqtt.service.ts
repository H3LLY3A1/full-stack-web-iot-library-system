import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';

type MessageHandler = (topic: string, message: string) => void;

@Injectable()
export class MqttService implements OnModuleInit {
  private client: mqtt.MqttClient;
  private logger = new Logger('MqttService');
  private enabled = process.env.MQTT_ENABLED !== 'false';
  private messageHandlers: MessageHandler[] = [];

  onModuleInit() {
    if (!this.enabled) {
      this.logger.log('MQTT is disabled via MQTT_ENABLED=false; skipping connection');
      return;
    }
    const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
    this.client = mqtt.connect(brokerUrl);

    this.client.on('connect', () => {
      this.logger.log(`Connected to MQTT broker ${brokerUrl}`);
      this.client.subscribe('raspberry/rfid/scan');
      this.client.subscribe('raspberry/rfid/cancel');
    });

    this.client.on('message', (topic, payload) => {
      const message = payload.toString();
      this.logger.log(`Received topic ${topic} payload ${message}`);

      this.messageHandlers.forEach(handler => {
        handler(topic, message);
      });
    });

    this.client.on('error', (err) => {
      this.logger.error(err.message);
    });
  }

  publish(topic: string, payload: any) {
    if (!this.enabled) {
      this.logger.debug(`MQTT disabled - skip publish to ${topic}`);
      return;
    }
    if (!this.client) return;
    const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
    this.client.publish(topic, message);
    this.logger.log(`Published to ${topic}: ${message}`);
  }

  subscribe(topic: string) {
    if (!this.enabled) {
      this.logger.debug(`MQTT disabled - skip subscribe to ${topic}`);
      return;
    }
    this.client?.subscribe(topic);
  }

  onMessage(callback: (topic: string, message: string) => void) {
    if (!this.enabled) return;

    if (!this.messageHandlers.includes(callback)) {
      this.messageHandlers.push(callback);
      this.logger.debug(`Registered new message handler (total: ${this.messageHandlers.length})`);
    }
  }

  offMessage(callback: (topic: string, message: string) => void) {
    if (!this.enabled) return;

    const index = this.messageHandlers.indexOf(callback);
    if (index !== -1) {
      this.messageHandlers.splice(index, 1);
      this.logger.debug(`Removed message handler (remaining: ${this.messageHandlers.length})`);
    }
  }
}
