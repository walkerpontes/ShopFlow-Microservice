import amqplib from 'amqplib';

 async function SetupRmq() {
    const conn = await amqplib.connect('amqp://localhost:5672');
    const channel = await conn.createChannel();
    await channel.assertExchange('err.dlx','direct', {durable: true})
    await channel.assertQueue('err_dlq', {durable:true})
    await channel.bindQueue('err_dlq', 'err.dlx', 'err.key.dlq')
    console.log('DLQ infrastructure successfully configured!')
    await channel.close()
    await conn.close();
 }

 await SetupRmq();