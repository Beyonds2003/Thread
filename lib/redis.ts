import { createClient } from "redis";

const redisClient = createClient({
  password: "Llqz2f9iw8jIVELV0Q4L2Jj3zJbHUXTN",
  socket: {
    host: "redis-15253.c292.ap-southeast-1-1.ec2.cloud.redislabs.com",
    port: 15253,
  },
});

if (!redisClient.isOpen) {
  redisClient.connect();
}

export { redisClient };
