import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Dropdown from '../components/Dropdown';

const New = ( {setNameStar} ) => {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [star, setStar] = useState(1);
    const [autoList, setAutoList] = useState([]);
    const [showList, setShowList] = useState(false);

    const getSearchMovie = async (search) => {
        if(!search) return;

        const ID_KEY = 'xmX4rXBFgRySFQDMBN1R';
        const SECRET_KEY = '13MEqeEJNs';

        const response = await fetch(`https://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/movie.json?query=${search}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Naver-Client-Id': ID_KEY,
                'X-Naver-Client-Secret': SECRET_KEY
            }
        })
        .then(res => res.json())
        .catch(err => console.error(err));

        const lists = response.items.slice(0,7);
        setShowList(true);
        setAutoList(lists);
    };

    useEffect(()=> {
        // 디바운스
        const debounce = setTimeout(() => {
            if(name) {
                getSearchMovie(name);
            }
        },100);
        return () => {
            clearTimeout(debounce);
        };

        // 스로틀링
/*         let timerId;

        return () => {
            if (timerId) return;
            timerId = setTimeout(()=> {
                getSearchMovie(name);
                timerId = null;
            }, 300);
        } */
    }, [name]);

    const handleInput = e => {
        setName(e.target.value);
    };

    const handleSelect = e => {
        setStar(e.target.value);
    }

    const onClick = () => {
        setNameStar(name, star);
        navigate('/create');
    }
    const id = useRef(-1);

    const handleDropdownClick = id => {
        setName(autoList[id].title?.replace(/<b>/gi,"").replace(/<\/b>/gi,""));
        setAutoList([]);
    }

    return (
        <div className="New">
            <h2>무슨 영화를 보셨나요?</h2>
            <input type='search' name='name' onChange={handleInput} value={name} placeholder="스타워즈 4: 새로운 희망" />
            {showList && <div className='AutoList'>
                {autoList.map((v,i) => {
                    id.current++;
                    return(
                        <div key={id.current} value={v.title} onClick={() => {
                            handleDropdownClick(i);
                        }}>
                            <Dropdown movieNm={v.title} />
                        </div>
                    );
                }
                )}
            </div>}
            <h2>몇 점을 주시겠어요?</h2>
            <select name='star' onChange={handleSelect} value={star}>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
            </select>
            <h2>
                <button onClick={onClick}>만들러 가기</button>
            </h2>
        </div>
    );
};

export default New;