import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const body = await req.json();
  
  console.log({body})
  const data = {
    "message": "here is a list of items in our inventory",
    "data_display_type": "card",
    "data": [
                {
                  "title": "Range Rover Sport 2012",
                  "image": "http://localhost:3000/cars.jpg",
                  "information": "A real car for sale", 
                  "metadata": [
                    {
                      "VIN": "SALWR2VF0FA535608"
                    },
                    {
                      "Accidents": "None"
                    },
                    {
                      "Colour": "Black"
                    },
                    {
                      "Price": "84,000 USD"
                    }
                  ], 
                  "actions": [
                    {
                      "text": "Select",
                      "link": "http://localhost:3000/cars.jpg",
                    }
                  ], 
                },
                {
                  "title": "Range Rover Sport 2012",
                  "image": "http://localhost:3000/cars.jpg",
                  "information": "A real car for sale", 
                  "metadata": [
                    {
                      "VIN": "SALWR2VF0FA535608"
                    },
                    {
                      "Accidents": "None"
                    },
                    {
                      "Colour": "Black"
                    },
                    {
                      "Price": "84,000 USD"
                    }
                  ], 
                  "actions": [
                    {
                      "text": "Select",
                      "instruct": "User selected Range Rover Sport 2012 with VIN SALWR2VF0FA535608",
                    }
                  ], 
                }
            ]
  }
  return NextResponse.json(data);
}
