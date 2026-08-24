function TodoItem({ title, goals, todo }) {

    return (
        <div className='border bg-purple-500/25 border-purple-400/25 rounded-4xl flex flex-col items-center w-md hover:scale-110 transition'>
            <h3 className='text-3xl font-semibold'>{title}</h3>

            <h4 className='text-xl font-light opacity-65 underline text-left w-full pl-6'>Goals</h4>
            <ul className='text-xl list-decimal text-left w-full pl-8 pb-2'>
                {
                    goals.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))
                }
            </ul>

            <h4 className='text-xl font-light opacity-65 underline text-left w-full pl-6'>TODO</h4>
            <ul className='text-xl list-decimal text-left w-full pl-8 pb-2'>
                {
                    todo.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))
                }
            </ul>
        </div>
    )

}

export default TodoItem;
