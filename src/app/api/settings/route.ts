import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Setting from '@/lib/models/setting'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const key = searchParams.get('key')
        await connectDB()
        if (key) {
            const setting = await Setting.findOne({ key })
            return NextResponse.json(setting || { key, value: { en: '', ar: '', he: '' } })
        }
        const settings = await Setting.find()
        return NextResponse.json(settings)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json()
        await connectDB()
        const setting = await Setting.findOneAndUpdate(
            { key: data.key },
            { value: data.value },
            { upsert: true, new: true }
        )
        return NextResponse.json(setting)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 })
    }
}
