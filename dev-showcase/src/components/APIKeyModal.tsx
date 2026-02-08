'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/src/components/ui/dialog'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { useAPIKeyStore } from '@/src/store/apiKeyStore'
import { Copy, CheckCircle2 } from 'lucide-react'

interface APIKeyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function APIKeyModal({ isOpen, onClose }: APIKeyModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState<'guide' | 'input'>('guide')
  const { setGoogleApiKey } = useAPIKeyStore()

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      alert('Please enter your API key')
      return
    }

    setGoogleApiKey(apiKey)
    setApiKey('')
    setStep('guide')
    onClose()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Setup Google API Key</DialogTitle>
          <DialogDescription>
            Get your API key to enable AI features
          </DialogDescription>
        </DialogHeader>

        {step === 'guide' ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">Follow these steps:</h3>
              
              <div className="space-y-3 text-sm text-blue-800">
                <div>
                  <p className="font-medium">1. Go to Google Cloud Console</p>
                  <p className="text-xs mt-1">Visit: 
                    <button 
                      onClick={() => window.open('https://console.cloud.google.com', '_blank')}
                      className="text-blue-600 underline ml-1"
                    >
                      console.cloud.google.com
                    </button>
                  </p>
                </div>

                <div>
                  <p className="font-medium">2. Create or select a project</p>
                  <p className="text-xs mt-1">Click "New Project" and name it</p>
                </div>

                <div>
                  <p className="font-medium">3. Enable Google Generative AI API</p>
                  <p className="text-xs mt-1">Search for "Generative AI" → enable it</p>
                </div>

                <div>
                  <p className="font-medium">4. Create API Key</p>
                  <p className="text-xs mt-1">Go to Credentials → Create Credentials → API Key</p>
                </div>

                <div>
                  <p className="font-medium">5. Copy your API Key</p>
                  <p className="text-xs mt-1">Copy the key that was generated (keep it private!)</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => window.open('https://console.cloud.google.com', '_blank')}
                className="flex-1"
              >
                Open Google Cloud
              </Button>
              <Button 
                onClick={() => setStep('input')}
                className="flex-1"
              >
                I have my API Key
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Paste your Google API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="AIza..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono text-xs"
              />
              <p className="text-xs text-gray-500">
                Your key is stored locally and never sent to our servers.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setApiKey('')
                  setStep('guide')
                }}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSaveKey}
                disabled={!apiKey.trim()}
                className="flex-1"
              >
                Save & Continue
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
