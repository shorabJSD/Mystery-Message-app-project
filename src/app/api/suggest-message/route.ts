import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
   const prompt= "Create a list of three open-ended and engaingin question formatted as a single string. Each question should be separeted by '||'. These questions are for an anoymous social messaging platform, like Qooh.me, and should be suitalbe for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you have recently stared? || If you could have dinner with any historical figure, who would it be? || What's a simeple thing that makes you happy? ||. Ensure the questions are intringguing, foster curiosity, and contribute to a positive and welcoming conversatinal environment."

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    prompt, 
  });

  return result.toAIStreamResponse();

  } catch (error) {
    if (error instanceof OpenAI.APIError) {
        const {name, status, headers, message} = error;
        return NextResponse.json({
            name, status, headers, message
        }, {status})
    } else {
        console.log("An upexpected error occured", error);
        throw error
    }
  }
}