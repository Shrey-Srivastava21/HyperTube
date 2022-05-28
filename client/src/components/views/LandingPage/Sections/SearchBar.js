import React, { useState, useRef } from 'react'
import { StyledSearchBar, StyledSearchBarContent } from './StyledSearchBar'
import { SearchOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ callback }) => {

  const { t } = useTranslation();
  const [state, setState] = useState('')
  const timeOut = useRef(null)
  //controlled component

  const doSearch = event => {
    // console.log(event.target.value)
    const { value } = event.target

    clearTimeout(timeOut.current)
    setState(value)

    timeOut.current = setTimeout(() => {
      callback(value)
    }, 500)
  }

  return (
    <StyledSearchBar>
      <StyledSearchBarContent>
        <SearchOutlined className="fa-search" style={{ fontSize: '30px' }} />
        <input
          type="text"
          className="large"
          placeholder={t('landing.search')}
          onChange={doSearch}
          value={state}
        />
        <input
          type="text"
          className="small"
          placeholder={t('landing.searchSmall')}
          onChange={doSearch}
          value={state}
        />
      </StyledSearchBarContent>
    </StyledSearchBar>
  )
}

SearchBar.propTypes = {
  callback: PropTypes.func,
}
export default SearchBar