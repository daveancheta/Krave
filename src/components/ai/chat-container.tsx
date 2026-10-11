"use client"
import { Send, X } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from '../ui/input-group'
import { useState } from 'react'
import { Avatar, AvatarImage } from '../ui/avatar';

function ChatContainer() {
    const [prompt, setPrompt] = useState<string>("")

    return (
        <div className='relative hidden h-full min-h-[420px] w-full flex-col rounded-xl border border-border/70 bg-background shadow-sm sm:min-w-0 sm:max-w-none sm:flex'>
            <div className='flex flex-col h-full'>
                <div className='flex items-center justify-between border-b px-4 py-3'>
                    <div className='flex flex-row items-center gap-2'>
                        <Avatar className='w-12 h-12'>
                            <AvatarImage className='object-cover w-full h-full' src="https://github.com/shadcn.png" />
                        </Avatar>
                        <div className='flex flex-col gap-1'>
                            <span className='font-bold'>Krave</span>
                            <div className='flex flex-row items-center gap-1.5'>
                                <div className='size-1.5 rounded-full bg-emerald-500'></div>
                                <span className='text-xs text-muted-foreground'>Active Now</span>
                            </div>
                        </div>
                    </div>
                    <button><X /></button>
                </div>

                <div className='flex-1 overflow-y-auto space-y-4 p-4 scrollable-div'>
                    <div className='flex flex-col items-start gap-2'>
                        <div className='w-fit max-w-60 rounded-2xl rounded-tl-sm bg-secondary p-4'>
                            <span className='text-sm text-secondary-foreground'>Hello! I’m Krave, your friendly AI chatbot assistant. I’m here to answer questions, provide guidance, and chat with you anytime. Ask me anything, and let’s explore and learn together!</span>
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
