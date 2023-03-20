//import React from 'react';
import React, { useEffect } from 'react';
import './App.css';


async function trendingNews() {
 
  const response = await fetch('https://bing-news-search1.p.rapidapi.com/news/trendingtopics?textFormat=Raw&safeSearch=Off&count=8', {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "bing-news-search1.p.rapidapi.com",
      "x-rapidapi-key": '16fc10ddf9mshef6d5e98e039c01p1011b6jsn83b29db0f933',
      "x-bingapis-sdk": "true"
    }
  });
  const body = await response.json();
  return body.value;
}


async function searchNews(q) {
  q = encodeURIComponent(q);
  const response = await fetch(`https://bing-news-search1.p.rapidapi.com/news/search?freshness=Day&textFormat=Raw&safeSearch=Strict&q=${q}`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "bing-news-search1.p.rapidapi.com",
      "x-rapidapi-key": '16fc10ddf9mshef6d5e98e039c01p1011b6jsn83b29db0f933',
      "x-bingapis-sdk": "true"
    }
  });
  const body = await response.json();
  
  return body.value;
}

function App() {
  const [query, setQuery] = React.useState("search");
  const [list, setList] = React.useState(null);
  const [trendingContent, setTrendingContent] = React.useState([]);

  const search = (e) => {
    e.preventDefault();
    searchNews(query).then(setList);
  };

 
//useEffect hook intializes the API request and populates the data
  useEffect(() => {
    let mounted = true;
    trendingNews()
      .then(items => {
        if(mounted) {
          setTrendingContent(items)
        }
      })
    return () => mounted = false;
  }, [])

  return (
    <div className="app">
      
     <header>Savage News Today</header>
     <h1>Trending Stories</h1>
     <ul className="trendingList">
       {trendingContent.map((item, i) => (
              <TrendingItem key={i} item={item} />
            ))}
     </ul>
   

      <h1>Bing News Search</h1>
      
      <form onSubmit={search}>
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button>Search</button>
      </form>

      {!list
        ? null
        : list.length === 0
          ? <p><i>No results</i></p>
          : <ul>
            {list.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </ul>
      }
    </div>
  );
}

function Item({ item }) {
  const separateWords = s => s.replace(/[A-Z][a-z]+/g, '$& ').trim();
  const formatDate = s => new Date(s).toLocaleDateString(undefined, { dateStyle: 'long' });

  return (
    <li className="item">
      {item.image &&
        <img className="thumbnail"
          alt=""
          src={item.image?.thumbnail?.contentUrl}
        />
      }

      <h2 className="title">
        <a href={item.url}>{item.name}</a>
      </h2>

      <p className="description">
        {item.description}
      </p>

      <div className="meta">
        <span>{formatDate(item.datePublished)}</span>

        <span className="provider">
          {item.provider[0].image?.thumbnail &&
            <img className="provider-thumbnail"
              alt=""
              src={item.provider[0].image.thumbnail.contentUrl + '&w=16&h=16'}
            />
          }
          {item.provider[0].name}
        </span>

        {item.category &&
          <span>{separateWords(item.category)}</span>
        }
      </div>
    </li>
  );
}
function TrendingItem({ item }) {
 
  return (
    <li className="trendingItem">
      {item.image &&
        <img className="thumbnail"
          alt=""
          src={item.image.url}
        />
      }

      <h2 className="title">
        <a href={item.newsSearchUrl}>{item.name}</a>
      </h2>

      <p className="description">
        {item.query.text}
      </p>

    </li>
  );
}

export default App;