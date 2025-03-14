import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const experiencesFilePath = path.join(process.cwd(), 'src/data/experiences.json')

// Simple authentication middleware for demo purposes
// In a real application, use proper authentication
function authenticate(req: NextRequest) {
  // For demo purposes only - in a real app, implement proper authentication
  const auth = req.headers.get('authorization')
  // This is a simple placeholder for demo purposes
  return true
}

export async function GET(req: NextRequest) {
  try {
    const data = fs.readFileSync(experiencesFilePath, 'utf8')
    const experiences = JSON.parse(data).experiences || []
    
    return NextResponse.json(experiences)
  } catch (error) {
    console.error('Error reading experiences file:', error)
    return NextResponse.json({ error: 'Failed to read experiences' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  // Check authentication
  if (!authenticate(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const experiences = await req.json()
    
    if (!Array.isArray(experiences)) {
      return NextResponse.json({ error: 'Invalid data format. Expected an array of experiences.' }, { status: 400 })
    }
    
    // Read the current file to maintain any other data structures that might be present
    const currentData = JSON.parse(fs.readFileSync(experiencesFilePath, 'utf8'))
    
    // Update only the experiences property
    const updatedData = { ...currentData, experiences }
    
    // Write back to the file
    fs.writeFileSync(experiencesFilePath, JSON.stringify(updatedData, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating experiences:', error)
    return NextResponse.json({ error: 'Failed to update experiences' }, { status: 500 })
  }
}