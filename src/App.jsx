import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { 
  Play, 
  Square, 
  Settings, 
  Activity, 
  Beaker, 
  Thermometer, 
  Droplet,
  BarChart3,
  Brain,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import './App.css'

function App() {
  // System status
  const [systemStatus, setSystemStatus] = useState('idle') // idle, running, paused, error
  const [connectedDevices, setConnectedDevices] = useState({
    uvvis: false,
    nir: false,
    liquidHandler: false,
    tempController: false
  })

  // Experiment parameters
  const [params, setParams] = useState({
    eg_volume_ml: 100,
    agno3_volume_ml: 5.0,
    pvp_volume_ml: 10.0,
    nacl_volume_ml: 1.0,
    temperature_c: 160,
    stirring_rpm: 500,
    reaction_time_min: 60
  })

  // Real-time data
  const [currentTemp, setCurrentTemp] = useState(25)
  const [targetTemp, setTargetTemp] = useState(160)
  const [stirringRPM, setStirringRPM] = useState(0)
  const [reactionProgress, setReactionProgress] = useState(0)
  
  // Spectroscopy data
  const [uvvisData, setUvvisData] = useState([])
  const [nirData, setNirData] = useState([])
  
  // ML optimization
  const [optimizationMode, setOptimizationMode] = useState(false)
  const [optimizationTarget, setOptimizationTarget] = useState('aspect_ratio')
  const [experimentsRun, setExperimentsRun] = useState(0)
  const [bestResult, setBestResult] = useState(null)

  // Experiment history
  const [experimentHistory, setExperimentHistory] = useState([
    {
      id: 1,
      timestamp: '2025-10-02 14:30',
      diameter_nm: 120,
      length_um: 15,
      yield_percent: 85,
      aspect_ratio: 125
    },
    {
      id: 2,
      timestamp: '2025-10-02 16:45',
      diameter_nm: 95,
      length_um: 20,
      yield_percent: 90,
      aspect_ratio: 211
    }
  ])

  // Simulated real-time temperature data
  const [tempHistory, setTempHistory] = useState([
    { time: 0, temp: 25, setpoint: 160 }
  ])

  // Simulate device connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectedDevices({
        uvvis: true,
        nir: true,
        liquidHandler: true,
        tempController: true
      })
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Simulate temperature updates when running
  useEffect(() => {
    if (systemStatus === 'running') {
      const interval = setInterval(() => {
        setCurrentTemp(prev => {
          const diff = targetTemp - prev
          const newTemp = prev + diff * 0.1 + (Math.random() - 0.5) * 2
          
          setTempHistory(history => {
            const newPoint = {
              time: history.length,
              temp: newTemp,
              setpoint: targetTemp
            }
            return [...history.slice(-30), newPoint]
          })
          
          return newTemp
        })
        
        setReactionProgress(prev => Math.min(prev + 0.5, 100))
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [systemStatus, targetTemp])

  const handleStartExperiment = () => {
    setSystemStatus('running')
    setReactionProgress(0)
    setTempHistory([{ time: 0, temp: currentTemp, setpoint: targetTemp }])
  }

  const handleStopExperiment = () => {
    setSystemStatus('idle')
    setReactionProgress(0)
  }

  const handleParamChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: parseFloat(value) || 0 }))
    if (key === 'temperature_c') {
      setTargetTemp(parseFloat(value) || 160)
    }
  }

  const DeviceStatusBadge = ({ connected, name }) => (
    <Badge variant={connected ? "default" : "secondary"} className="flex items-center gap-1">
      {connected ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
      {name}
    </Badge>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Autonomous AgNW Synthesis Lab
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-Driven Silver Nanowire Production System
            </p>
          </div>
          
          <div className="flex gap-2">
            <DeviceStatusBadge connected={connectedDevices.uvvis} name="UV-Vis" />
            <DeviceStatusBadge connected={connectedDevices.nir} name="NIR" />
            <DeviceStatusBadge connected={connectedDevices.liquidHandler} name="Pumps" />
            <DeviceStatusBadge connected={connectedDevices.tempController} name="Heater" />
          </div>
        </div>

        {/* System Status Bar */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Activity className={`w-5 h-5 ${systemStatus === 'running' ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
                  <span className="font-semibold">
                    Status: <span className="text-blue-600 dark:text-blue-400">{systemStatus.toUpperCase()}</span>
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                  <span className="font-mono">{currentTemp.toFixed(1)}°C / {targetTemp}°C</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="font-mono">{stirringRPM} RPM</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {systemStatus !== 'running' ? (
                  <Button onClick={handleStartExperiment} className="bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4 mr-2" />
                    Start Experiment
                  </Button>
                ) : (
                  <Button onClick={handleStopExperiment} variant="destructive">
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                )}
              </div>
            </div>
            
            {systemStatus === 'running' && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Reaction Progress</span>
                  <span className="text-sm font-mono">{reactionProgress.toFixed(1)}%</span>
                </div>
                <Progress value={reactionProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="control" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="control" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Control
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Monitor
            </TabsTrigger>
            <TabsTrigger value="spectroscopy" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Spectroscopy
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Optimization
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Control Panel */}
          <TabsContent value="control" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Synthesis Parameters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="w-5 h-5" />
                    Synthesis Parameters
                  </CardTitle>
                  <CardDescription>Configure reagent volumes and conditions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="eg_volume">Ethylene Glycol (mL)</Label>
                    <Input
                      id="eg_volume"
                      type="number"
                      value={params.eg_volume_ml}
                      onChange={(e) => handleParamChange('eg_volume_ml', e.target.value)}
                      disabled={systemStatus === 'running'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="agno3_volume">AgNO₃ Solution (mL)</Label>
                    <Input
                      id="agno3_volume"
                      type="number"
                      step="0.1"
                      value={params.agno3_volume_ml}
                      onChange={(e) => handleParamChange('agno3_volume_ml', e.target.value)}
                      disabled={systemStatus === 'running'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pvp_volume">PVP Solution (mL)</Label>
                    <Input
                      id="pvp_volume"
                      type="number"
                      step="0.1"
                      value={params.pvp_volume_ml}
                      onChange={(e) => handleParamChange('pvp_volume_ml', e.target.value)}
                      disabled={systemStatus === 'running'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nacl_volume">NaCl Solution (mL)</Label>
                    <Input
                      id="nacl_volume"
                      type="number"
                      step="0.1"
                      value={params.nacl_volume_ml}
                      onChange={(e) => handleParamChange('nacl_volume_ml', e.target.value)}
                      disabled={systemStatus === 'running'}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Process Parameters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5" />
                    Process Parameters
                  </CardTitle>
                  <CardDescription>Temperature, stirring, and reaction time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="temperature">Temperature (°C)</Label>
                      <span className="text-sm font-mono text-muted-foreground">
                        {params.temperature_c}°C
                      </span>
                    </div>
                    <Slider
                      id="temperature"
                      min={140}
                      max={180}
                      step={1}
                      value={[params.temperature_c]}
                      onValueChange={(value) => handleParamChange('temperature_c', value[0])}
                      disabled={systemStatus === 'running'}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="stirring">Stirring Speed (RPM)</Label>
                      <span className="text-sm font-mono text-muted-foreground">
                        {params.stirring_rpm} RPM
                      </span>
                    </div>
                    <Slider
                      id="stirring"
                      min={300}
                      max={800}
                      step={50}
                      value={[params.stirring_rpm]}
                      onValueChange={(value) => {
                        handleParamChange('stirring_rpm', value[0])
                        setStirringRPM(value[0])
                      }}
                      disabled={systemStatus === 'running'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reaction_time">Reaction Time (min)</Label>
                    <Input
                      id="reaction_time"
                      type="number"
                      value={params.reaction_time_min}
                      onChange={(e) => handleParamChange('reaction_time_min', e.target.value)}
                      disabled={systemStatus === 'running'}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Real-time Monitoring */}
          <TabsContent value="monitor" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Temperature Profile</CardTitle>
                <CardDescription>Real-time temperature monitoring with PID control</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={tempHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="temp" stroke="#ef4444" name="Current Temp" strokeWidth={2} />
                    <Line type="monotone" dataKey="setpoint" stroke="#3b82f6" name="Setpoint" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pump Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pump 1 (EG)</span>
                    <Badge variant="secondary">Ready</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pump 2 (AgNO₃)</span>
                    <Badge variant="secondary">Ready</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pump 3 (PVP)</span>
                    <Badge variant="secondary">Ready</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pump 4 (NaCl)</span>
                    <Badge variant="secondary">Ready</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Heater Control</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Current</span>
                    <span className="font-mono font-semibold">{currentTemp.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Setpoint</span>
                    <span className="font-mono font-semibold">{targetTemp}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">PID Output</span>
                    <span className="font-mono font-semibold">
                      {systemStatus === 'running' ? '75%' : '0%'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Safety Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Temperature OK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Pressure OK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">E-Stop Ready</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Spectroscopy */}
          <TabsContent value="spectroscopy" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>UV-Vis Absorbance Spectrum</CardTitle>
                  <CardDescription>8-channel visible spectrum (415-680 nm)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={[
                      { wavelength: 415, absorbance: 0.12 },
                      { wavelength: 445, absorbance: 0.25 },
                      { wavelength: 480, absorbance: 0.45 },
                      { wavelength: 515, absorbance: 0.38 },
                      { wavelength: 555, absorbance: 0.22 },
                      { wavelength: 590, absorbance: 0.15 },
                      { wavelength: 630, absorbance: 0.10 },
                      { wavelength: 680, absorbance: 0.08 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="wavelength" label={{ value: 'Wavelength (nm)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Absorbance', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="absorbance" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      Peak Analysis: λ_max = 480 nm → Estimated Diameter: ~110 nm
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>NIR Transmittance</CardTitle>
                  <CardDescription>Near-infrared (940-1550 nm)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={[
                      { wavelength: 940, transmittance: 0.85 },
                      { wavelength: 1450, transmittance: 0.72 },
                      { wavelength: 1550, transmittance: 0.78 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="wavelength" label={{ value: 'Wavelength (nm)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Transmittance', angle: -90, position: 'insideLeft' }} domain={[0, 1]} />
                      <Tooltip />
                      <Area type="monotone" dataKey="transmittance" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                      PVP Binding Detected: Strong absorption at 1450 nm
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Optimization */}
          <TabsContent value="optimization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Bayesian Optimization
                </CardTitle>
                <CardDescription>
                  AI-driven parameter optimization using Gaussian Process Regression
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="opt-mode">Enable Autonomous Optimization</Label>
                    <p className="text-sm text-muted-foreground">
                      System will automatically suggest and run experiments
                    </p>
                  </div>
                  <Switch
                    id="opt-mode"
                    checked={optimizationMode}
                    onCheckedChange={setOptimizationMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Optimization Target</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={optimizationTarget === 'aspect_ratio' ? 'default' : 'outline'}
                      onClick={() => setOptimizationTarget('aspect_ratio')}
                      className="w-full"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Aspect Ratio
                    </Button>
                    <Button
                      variant={optimizationTarget === 'diameter' ? 'default' : 'outline'}
                      onClick={() => setOptimizationTarget('diameter')}
                      className="w-full"
                    >
                      Diameter
                    </Button>
                    <Button
                      variant={optimizationTarget === 'yield' ? 'default' : 'outline'}
                      onClick={() => setOptimizationTarget('yield')}
                      className="w-full"
                    >
                      Yield
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm text-muted-foreground">Experiments Run</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {experimentsRun}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <p className="text-sm text-muted-foreground">Best Aspect Ratio</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      211
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <p className="text-sm text-muted-foreground">Model Confidence</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      87%
                    </p>
                  </div>
                </div>

                {optimizationMode && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      Next Suggested Experiment
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Temperature: <span className="font-mono font-semibold">172°C</span></div>
                      <div>PVP/AgNO₃: <span className="font-mono font-semibold">2.3</span></div>
                      <div>Stirring: <span className="font-mono font-semibold">650 RPM</span></div>
                      <div>NaCl: <span className="font-mono font-semibold">2.5 mM</span></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Expected: Diameter 88nm, Length 19μm, Aspect Ratio 216
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experiment History */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Experiment History</CardTitle>
                <CardDescription>Past synthesis results and characterization data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {experimentHistory.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Experiment #{exp.id}</span>
                        <span className="text-sm text-muted-foreground">{exp.timestamp}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Diameter</p>
                          <p className="font-mono font-semibold">{exp.diameter_nm} nm</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Length</p>
                          <p className="font-mono font-semibold">{exp.length_um} μm</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Yield</p>
                          <p className="font-mono font-semibold">{exp.yield_percent}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Aspect Ratio</p>
                          <p className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                            {exp.aspect_ratio}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
