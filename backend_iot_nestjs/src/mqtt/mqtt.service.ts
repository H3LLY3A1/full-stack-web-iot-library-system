import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  private client: mqtt.MqttClient;
  private logger = new Logger('MqttService');
  private enabled = process.env.MQTT_ENABLED !== 'false';

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
      this.logger.log(`Received topic ${topic} payload ${payload.toString()}`);
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
    this.client?.on('message', (topic, buf) => callback(topic, buf.toString()));
  }
}
