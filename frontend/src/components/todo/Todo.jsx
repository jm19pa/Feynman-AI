import { useState } from 'react'
import TodoItem from './todo-item/TodoItem';

function Todo() {
    return (
        <section className='p-4 lg:p-0 lg:pb-6 lg:pt-6 min-h-svh bg-neutral-50/1'>
            <div className='flex items-center flex-col lg:w-75vw max-w-7xl m-auto'>
                <h1 className='text-5xl font-extrabold'>TODO List</h1>

                <p>Leave styling for Val</p>
                <p>Let Juan do the Database stuff</p>

                <div className='flex flex-wrap justify-center gap-5 pt-6'>

                    <TodoItem
                        title={'Home Page'}
                        goals={['Description of application', 'Project exigence', 'Demo video']}
                        todo={['Styling', 'Write exigence', 'Create description', 'Record video']}
                    />

                    <TodoItem
                        title={'Login'}
                        goals={['Username & Password', 'Forgot password']}
                        todo={['Styling', 'Database to store users']}
                    />

                    <TodoItem
                        title={'Signup'}
                        goals={['Username, Password, Confirm Password, Email', 'Forgot password']}
                        todo={[]}
                    />

                    <TodoItem
                        title={'Email Verification Page'}
                        goals={['6 digit confirmation', 'Re-send code']}
                        todo={[]}
                    />

                    <TodoItem
                        title={'About Us'}
                        goals={['Description of all of those who worked on the project']}
                        todo={[]}
                    />

                    <TodoItem
                        title={'Chat'}
                        goals={['Question & Response', 'Save chat history', 'Multiple conversations', 'Send images', 'Compress images', 'Draw, color, fill, erase, brush sizes']}
                        todo={[]}
                    />
                </div>
            </div>
        </section>
    );
}

export default Todo;