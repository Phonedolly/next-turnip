import dbus from '@homebridge/dbus-native'

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })

  var bus = dbus.sessionBus();
  
  var destination = 'org.next.turnip';
  bus.invoke(
    {
      path: '/0/1',
      destination: destination,
      interface: 'org.next.turnip.builder',
      member: 'reverse',
      signature: 's',
      body: ['BUILD_START']
    });

  bus.connection.on('message', function(msg){
    console.log(msg.body);
  })
}