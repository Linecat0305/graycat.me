import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const educationFilePath = path.join(process.cwd(), 'src/data/education.json')

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
    const data = fs.readFileSync(educationFilePath, 'utf8')
    const educationData = JSON.parse(data)
    const education = educationData.education || []
    
    return NextResponse.json(education)
  } catch (error) {
    console.error('Error reading education file:', error)
    return NextResponse.json({ error: 'Failed to read education data' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  // Check authentication
  if (!authenticate(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const education = await req.json()
    
    if (!Array.isArray(education)) {
      return NextResponse.json({ error: 'Invalid data format. Expected an array of education entries.' }, { status: 400 })
    }
    
    // Read the current file to maintain any other data structures that might be present
    const currentData = JSON.parse(fs.readFileSync(educationFilePath, 'utf8'))
    
    // Update only the education property
    const updatedData = { ...currentData, education }
    
    // Write back to the file
    fs.writeFileSync(educationFilePath, JSON.stringify(updatedData, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating education:', error)
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 })
  }
}