"use client"
import { Send, X } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from '../ui/input-group'
import { useState } from 'react'
import { Avatar, AvatarImage } from '../ui/avatar';

function ChatContainer() {
    const [prompt, setPrompt] = useState<string>("")

    return (
        <div className='sm:relative bg-background border
        rounded-md sm:min-w-100 max-w-100 flex-col w-screen text-start sm:block hidden'>
            <div className='flex flex-col h-full'>
                <div className='flex items-center justify-between px-4 py-2 border-b-2'>
                    <div className='flex flex-row items-center gap-2'>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                        </Avatar>
                        <div className='flex flex-col gap-1'>
                            <span className='font-bold'>Krave</span>
                            <div className='flex flex-row items-center gap-1'>
                                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                <span className='text-xs'>Active Now</span>
                            </div>
                        </div>
                    </div>
                    <button><X /></button>
                </div>

                <div className='flex-1 overflow-y-auto space-y-4 p-2 scrollable-div'>
                    <div className='flex flex-col items-start gap-2'>
                        <div className='bg-black dark:bg-white rounded-lg p-4 w-fit max-w-60'>
                            <span className='text-white dark:text-black text-sm'>Hello! I’m Krave, your friendly AI chatbot assistant. I’m here to answer questions, provide guidance, and chat with you anytime. Ask me anything, and let’s explore and learn together!</span>
                        </div>
                    </div>

                </div>

                <InputGroup className='rounded-t-none'>
                    <InputGroupTextarea
                        id="block-end-textarea"
                        placeholder="Aa"
                        maxLength={100}
                        onChange={(e) => setPrompt(e.target.value)}
                        value={prompt}
                    />
                    <InputGroupAddon align="block-end">
                        <InputGroupText>{prompt.length}/100</InputGroupText>
                        <InputGroupButton variant="default" size="sm"
                            className="ml-auto" disabled={!prompt}>
                            <Send />
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div >
        </div >
    )
}

export default ChatContainer