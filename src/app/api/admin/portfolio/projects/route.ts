import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const projectsFilePath = path.join(process.cwd(), 'src/data/projects.json')

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
    const data = fs.readFileSync(projectsFilePath, 'utf8')
    const projects = JSON.parse(data).projects || []
    
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error reading projects file:', error)
    return NextResponse.json({ error: 'Failed to read projects' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  // Check authentication
  if (!authenticate(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const projects = await req.json()
    
    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: 'Invalid data format. Expected an array of projects.' }, { status: 400 })
    }
    
    // Read the current file to maintain any other data structures that might be present
    const currentData = JSON.parse(fs.readFileSync(projectsFilePath, 'utf8'))
    
    // Update only the projects property
    const updatedData = { ...currentData, projects }
    
    // Write back to the file
    fs.writeFileSync(projectsFilePath, JSON.stringify(updatedData, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating projects:', error)
    return NextResponse.json({ error: 'Failed to update projects' }, { status: 500 })
  }
}