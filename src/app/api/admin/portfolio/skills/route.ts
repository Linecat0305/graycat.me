import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const skillsFilePath = path.join(process.cwd(), 'src/data/skills.json')

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
    const data = fs.readFileSync(skillsFilePath, 'utf8')
    const skills = JSON.parse(data).skills || []
    
    return NextResponse.json(skills)
  } catch (error) {
    console.error('Error reading skills file:', error)
    return NextResponse.json({ error: 'Failed to read skills' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  // Check authentication
  if (!authenticate(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const skills = await req.json()
    
    if (!Array.isArray(skills)) {
      return NextResponse.json({ error: 'Invalid data format. Expected an array of skills.' }, { status: 400 })
    }
    
    // Read the current file to maintain any other data structures that might be present
    const currentData = JSON.parse(fs.readFileSync(skillsFilePath, 'utf8'))
    
    // Update only the skills property
    const updatedData = { ...currentData, skills }
    
    // Write back to the file
    fs.writeFileSync(skillsFilePath, JSON.stringify(updatedData, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating skills:', error)
    return NextResponse.json({ error: 'Failed to update skills' }, { status: 500 })
  }
}