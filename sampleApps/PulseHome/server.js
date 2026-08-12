const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Enhanced In-memory IoT Device Database
let devices = [
    { id: 1, name: 'Neon Ambient Lights', room: 'Living Room', type: 'lighting', state: true, value: 85, unit: '%', icon: '💡', color: 'text-amber-400' },
    { id: 2, name: 'Master Thermostat', room: 'Living Room', type: 'climate', state: true, value: 22.5, unit: '°C', icon: '🌡️', color: 'text-cyan-400' },
    { id: 3, name: 'Perimeter Smart Lock', room: 'Exterior', type: 'security', state: true, value: 'Locked', unit: '', icon: '🔒', color: 'text-emerald-400' },
    { id: 4, name: 'Solar Array Inverter', room: 'Exterior', type: 'energy', state: true, value: 4.2, unit: 'kW', icon: '☀️', color: 'text-yellow-400' },
    { id: 5, name: 'Kitchen Air Purifier', room: 'Kitchen', type: 'climate', state: true, value: 60, unit: '% Speed', icon: '🍃', color: 'text-teal-400' }
];

let systemLogs = [
    { time: '12:00 PM', event: 'System booted successfully. All MQTT brokers connected.' }
];

function addLog(event) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    systemLogs.unshift({ time, event });
    if (systemLogs.length > 15) systemLogs.pop();
}

// API: Get all IoT devices
app.get('/api/devices', (req, res) => res.json(devices));

// API: Toggle device state
app.post('/api/devices/:id/toggle', (req, res) => {
    const device = devices.find(d => d.id === parseInt(req.params.id));
    if (device) {
        device.state = !device.state;
        addLog(`Device '${device.name}' was ${device.state ? 'turned ON' : 'turned OFF'}.`);
        res.json({ success: true, device, logs: systemLogs });
    } else {
        res.status(404).json({ error: 'Device not found' });
    }
});

// API: Update device numeric value (sliders)
app.post('/api/devices/:id/update', (req, res) => {
    const { value } = req.body;
    const device = devices.find(d => d.id === parseInt(req.params.id));
    if (device) {
        device.value = value;
        addLog(`Device '${device.name}' adjusted to ${value}${device.unit}.`);
        res.json({ success: true, device, logs: systemLogs });
    } else {
        res.status(404).json({ error: 'Device not found' });
    }
});

// API: Register new smart device
app.post('/api/devices', (req, res) => {
    const { name, room, type, icon, unit } = req.body;
    const newDevice = {
        id: devices.length ? devices[devices.length - 1].id + 1 : 1,
        name: name || 'Smart Gadget',
        room: room || 'Living Room',
        type: type || 'lighting',
        state: true,
        value: 50,
        unit: unit || '',
        icon: icon || '🔌',
        color: 'text-cyan-400'
    };
    devices.push(newDevice);
    addLog(`New device '${newDevice.name}' registered to mesh network.`);
    res.json({ success: true, devices, logs: systemLogs });
});

// API: Trigger Automation Scenes
app.post('/api/scenes/:mode', (req, res) => {
    const mode = req.params.mode;
    if (mode === 'away') {
        devices.forEach(d => { if(d.type === 'lighting') d.state = false; });
        addLog('Activated SCENE: Away Mode. All interior lighting nodes powered down.');
    } else if (mode === 'party') {
        devices.forEach(d => { if(d.type === 'lighting') d.state = true; });
        addLog('Activated SCENE: Party Mode. All lighting nodes maxed out.');
    }
    res.json({ success: true, devices, logs: systemLogs });
});

// API: Get system logs
app.get('/api/logs', (req, res) => res.json(systemLogs));

app.listen(PORT, () => {
    console.log(`🏠 PulseHome Pro Server running at http://localhost:${PORT}`);
});