import {useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import { GET_ALL_USERS, GET_ONE_USER } from './query/user';
import './App.css'
import { useForm } from 'react-hook-form';
import { CREATE_USER } from './mutation/user';


function App() {
    const { data, loading, error, refetch } = useQuery(GET_ALL_USERS)
    const { data: oneUser, loading: loadingOneUser } = useQuery(GET_ONE_USER, {
        variables: {
            id: 1
        }
    })

    console.log('1', oneUser);

    const [newUser] = useMutation(CREATE_USER)
    const [users, setUsers] = useState([])
    const { handleSubmit, form, register, reset } = useForm({
        defaultValues: {
            username: '',
            age: 0
        }
    });
    console.log(data);


    useEffect(() => {
        if (!loading) {
            setUsers(data.getAllUsers)
        }
    }, [data]);

    if (loading) {
        return <h1>Loading</h1>
    }

    const addUser = (username, age) => {
        console.log(username, age)
        newUser({
            variables: {
                input: {
                    username, age
                }
            }
        }).then(({data}) => {
            console.log(data)
        })
    }

    const getAll = (e) => {
        e.preventDefault()
        refetch()
    }

    const onSubmit = (data) => {addUser(String(data.username), Number(data.age))
        console.log(data)

        reset();
    }

    return (
        <div >
            <form onSubmit={ handleSubmit(onSubmit) }>
                <input type='text' name='username' autoComplete='off' {...register('username')}/>
                <input type='number' name='age' autoComplete='off' {...register('age')}/>
                <div className='btns'>
                    <button type='submit'>Create</button>
                    <button onClick={(e) => getAll(e)}>Get</button>
                </div>
            </form>
            <div>
                {users.map((user, i) =>
                    <div className='user' key={i}>{i+1} {user.username} {user.age}</div>
                )}
            </div>
        </div>
    );
}

export default App;
